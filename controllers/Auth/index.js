const bcrypt = require("bcrypt");

const supabase = require("../../services/Supabase");
const { generateToken, validateToken } = require("../../services/JWT");

const { tableName } = require("../../enums/Supabase");

const TableName = tableName.User;

const getUser = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ status: false, message: "You are not logged in" });

    validateToken(token.split("Bearer ")[1]);
    return res.status(200).json({ status: true, message: "JWT token validated." });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password, registration_token } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: userExists } = await supabase.from(TableName).select("id").eq("email", email).single();

    if (userExists) {
      throw new Error("User already exists.");
    }

    const { data, error } = await supabase.from(TableName).insert({ email, password: hashedPassword, registration_token }).select();

    if (error) {
      return res.status(400).json({ status: false, message: error.message });
    }

    const token = generateToken(data[0]);

    return res.status(201).json({ status: true, message: "Signup successful", token });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, registration_token } = req.body;

    const { data, error: userError } = await supabase.from(TableName).select("*").eq("email", email).single();

    if (userError || !data) {
      return res.status(400).json({ error: "User not found" });
    }

    if (await bcrypt.compare(password, data.password)) {
      const { error: updateError } = await supabase.from(TableName).update({ registration_token }).eq("id", data.id);

      if (updateError) {
        throw new Error("Unable to update registration token.");
      }

      const token = generateToken(data);

      return res.status(200).json({ status: true, message: "Login successful", token });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
};
