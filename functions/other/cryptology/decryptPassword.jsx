import bcrypt from "bcryptjs";

/**
 * Supports:
 * - Full bcrypt hashes (60 chars)
 * - Legacy truncated hashes from VARCHAR(40) era (< 60, typically 40)
 */
const DecryptPassword = async (LoginPassword, databasePassword) => {
  try {
    if (!LoginPassword || !databasePassword) {
      throw new Error("Password is empty");
    }

    const hash = String(databasePassword).trim();
    if (!hash) {
      throw new Error("Password is empty");
    }

    // Legacy truncated bcrypt: reconstruct with embedded salt, compare prefix
    if (hash.startsWith("$2") && hash.length >= 29 && hash.length < 60) {
      const salt = hash.slice(0, 29);
      const rehash = await bcrypt.hash(LoginPassword, salt);
      const result = rehash.slice(0, hash.length) === hash;
      if (!result) throw new Error("Password is wrong");
      return result;
    }

    const result = await bcrypt.compare(LoginPassword, hash);
    if (!result) throw new Error("Password is wrong");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default DecryptPassword;
