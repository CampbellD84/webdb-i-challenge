const express = require("express");
const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
  const accounts = await db("accounts");

  try {
    res.status(200).json(accounts);
  } catch ({ error }) {
    res.status(500).json({ error, message: "Error retrieving accounts." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const [account] = await db("accounts").where({ id });

  try {
    if (account) {
      res.status(200).json(account);
    } else {
      res
        .status(404)
        .json({ message: `Account with the ID of ${id} cannot be found.` });
    }
  } catch ({ error }) {
    res.status(500).json({ error, message: "Cannot retrieve account." });
  }
});

router.post("/", async (req, res) => {
  const acctData = req.body;
  const account = await db("accounts").insert(acctData);

  try {
    res.status(201).json(account);
  } catch ({ error }) {
    res.status(500).json({ error, message: "Could not add account." });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const acctChanges = req.body;
  const count = await db("accounts")
    .where("id", "=", id)
    .update(acctChanges);
  try {
    if (count) {
      res.status(200).json({ updated: count });
    } else {
      res
        .status(404)
        .json({ message: `Cannot find account with ID of ${id}.` });
    }
  } catch ({ error }) {
    res.status(500).json({ error, message: "Could not update account." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const count = await db("accounts")
    .where({ id })
    .del();

  try {
    if (count) {
      res
        .status(200)
        .json({
          message: `Account with ID of ${id} successfully deleted.`,
          deleted: count
        });
    } else {
      res
        .status(404)
        .json({ message: `Account with ID of ${id} could not be found.` });
    }
  } catch ({ error }) {
    res.status(500).json({ error, message: "Could not delete account." });
  }
});

module.exports = router;
