

const Product = require("../models/Product");
const crypto = require("crypto");
/* ---------------- SMART KEYWORD ---------------- */
const getSmartKeyword = (name) => {
  const stopWords = new Set([
    "karmaas",
    "organic",
    "natural",
    "pure",
    "leaf",
    "powder",
    "extract",
    "100%",
    "and",
    "&",
    "|",
    "mg",
    "g",
    "ml",
    "of",
    "for",
    "the"
  ]);

  const words = (name || "")
    .toLowerCase()
    .replace(/[^a-zA-Z ]/g, " ")
    .split(" ")
    .filter(w => w && !stopWords.has(w));

  return (words[0] || "ITEM").toUpperCase();
};

/* ---------------- RANDOM CODE ---------------- */
const getRandomCode = () => {
  return crypto.randomBytes(2).toString("hex").toUpperCase();
};

/* ---------------- MAIN SKU GENERATOR ---------------- */
const generateSKU = async (product) => {
  const brand = "KMA";
  const keyword = getSmartKeyword(product.name);

  let sku = `${brand}-${keyword}-${getRandomCode()}`;

  // ensure uniqueness
  let exists = await Product.findOne({ sku });

  while (exists) {
    sku = `${brand}-${keyword}-${getRandomCode()}`;
    exists = await Product.findOne({ sku });
  }

  return sku;
};

module.exports = generateSKU;