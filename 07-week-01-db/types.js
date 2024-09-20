const z = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(20, { message: "Name cannot exceed 20 characters." }),
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(15, { message: "Email cannot exceed 15 characters." })
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .trim()
    .min(5, { message: "Password must be at least 5 characters long." })
    .max(15, { message: "Password cannot exceed 15 characters." })
    .toLowerCase(),
});

const loginSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(15, { message: "Email cannot exceed 15 characters." })
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .trim()
    .min(5, { message: "Password must be at least 5 characters long." })
    .max(15, { message: "Password cannot exceed 15 characters." })
    .toLowerCase(),
});

const taskSchema = z.object({
  description: z.string().min(3).max(20),
  isCompleted: z.boolean(),
});

module.exports = {
  registerSchema,
  loginSchema,
  taskSchema,
};
