const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
const uri =
	"mongodb+srv://Mohib:Mohib@cluster0.nr9ns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
async function run() {
	try {
		await client.connect();
		const database = client.db("FoodMaster");
		const usersCollection = database.collection("Users");
		// get api
		app.get("/users", async (req, res) => {
			const cursor = usersCollection.find({});
			const users = await cursor.toArray();
			res.send(users);
		});
		// post api
		app.post("/users", async (req, res) => {
			const newUser = req.body;
			const result = await usersCollection.insertOne(newUser);
			console.log("hitting the post", result);
			res.json(result);
		});
		// update api
		app.put("/users/:id", async (req, res) => {
			const id = req.params.id;
			const user = req.body;
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					name: user.name,
					email: user.email,
					city: user.city,
				},
			};
			const result = await usersCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			console.log("update is hitting");
			res.json(result);
		});
		// delete api
		app.delete("/users/:id", async (req, res) => {
			const id = req.params.id;
			console.log(id);
			const query = { _id: ObjectId(id) };
			const result = await usersCollection.deleteOne(query);
			console.log("hitting the delete api", result);
			res.json(result);
		});
		// single user or update user
		app.get("/users/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await usersCollection.findOne(query);
			console.log("hitting single user");
			res.send(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Node MongoDb Cured operation");
});

app.listen(port, () => {
	console.log("server is loading ", port);
});
