import bcrypt from "bcryptjs";

const EncryptPassword = async (password) => {
  try {
    if (!password) throw new Error("Error: Password is empty");
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Full bcrypt hash must be 60 chars (column is now VARCHAR(150))
    if (typeof hashed !== "string" || hashed.length !== 60) {
      throw new Error(
        `Invalid bcrypt hash length: ${hashed?.length ?? "n/a"} (expected 60)`
      );
    }

    return hashed;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default EncryptPassword;
