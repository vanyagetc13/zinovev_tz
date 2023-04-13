var express = require("express");
var fs = require("fs");
var cors = require("cors");
var { Document } = require("docxyz");
var fileUpload = require("express-fileupload");

const app = express();
app.use(express.json());
app.use(cors());
app.use(
	fileUpload({
		createParentPath: true,
	})
);

function itteration(doc, callback) {
	doc.paragraphs.forEach((p, ind) => {
		for (const [key, node] of Object.entries(
			p._element.xmlElement.childNodes
		)) {
			if (typeof node === "object") {
				for (const [skey, value] of Object.entries(node.childNodes)) {
					if (typeof value === "object") {
						for (const [vkey, vnode] of Object.entries(
							value.childNodes
						)) {
							const keys = { ind, key, skey, vkey };
							if (typeof vnode.data === "string")
								callback(keys, vnode);
						}
					}
				}
			}
		}
	});
}

app.post("/file", (req, res) => {
	try {
		const file = req.files.file;
		const { path, inputsFormData } = req.body;
		const inputs = JSON.parse(inputsFormData);
		const doc = new Document(file.data);
		const arrayOfText = [];
		itteration(doc, (keys, vnode) => {
			const t = vnode.data;
			if (t) arrayOfText.push({ keys, text: t });
		});
		const results = [];
		for (let j = 0; j < inputs.length; j++) {
			let startIndex = -1;
			let string = "";
			for (let i = 0; i < arrayOfText.length; i++) {
				const name = inputs[j].name;
				string += arrayOfText[i].text;
				if (name.includes(arrayOfText[i].text) && startIndex === -1) {
					startIndex = i;
				}
				if (string.includes(".")) string = string.replace(".", "");
				if (!name.includes(string)) {
					startIndex = -1;
					string = "";
				}
				if (string.includes(name)) {
					results.push({ startIndex, lastIndex: i });
					startIndex = -1;
					string = "";
				}
			}
		}
		const arrayOfKeys = [];
		for (let i = 0; i < results.length; i++) {
			for (
				let j = results[i].startIndex;
				j <= results[i].lastIndex;
				j++
			) {
				arrayOfKeys.push(arrayOfText[j]);
			}
		}
		for (let j = 0; j < inputs.length; j++) {
			let str = "";
			let data = [];
			for (let i = 0; i < arrayOfKeys.length; i++) {
				let t = arrayOfKeys[i].text;
				if (t.includes(".")) {
					t = t.replace(".", "");
				}
				str += t;
				data.push(arrayOfKeys[i].keys);
				if (!inputs[j].name.includes(str)) {
					str = "";
					data = [];
				}
				if (str === inputs[j].name) {
					for (let b = 0; b < data.length; b++) {
						const { ind, key, skey, vkey } = data[b];
						if (b === 0) {
							doc.paragraphs[ind]._element.xmlElement.childNodes[
								key
							].childNodes[skey].childNodes[vkey].data =
								inputs[j].value;
						} else if (b === data.length - 1) {
							doc.paragraphs[ind]._element.xmlElement.childNodes[
								key
							].childNodes[skey].childNodes[vkey].data =
								arrayOfKeys[i].text.includes(".") ? "." : "";
						} else {
							doc.paragraphs[ind]._element.xmlElement.childNodes[
								key
							].childNodes[skey].childNodes[vkey].data = "";
						}
					}
					data = [];
					str = "";
				}
			}
		}
		const fullPath = "./client/public/files/" + Number(new Date()) + path;
		doc.save(fullPath);
		res.status(200).json(fullPath);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

app.post("/delete", (req, res) => {
	try {
		let path = req.body.path;
		if (!path.includes("/client/public")) {
			path = path.replace("./files", "./client/public/files");
		}
		fs.unlinkSync(path);
		res.status(200).json(`${path} file deleted`);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

app.listen(4444, () => {
	console.log("Server is OK!");
});
