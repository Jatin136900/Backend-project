import http from "http";
// import sum from "./sum.js";




const server = http.createServer((req, res) => {

    //GET API 
    if (req.method === "GET") {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(sum));
    }

    //POST API
    else if (req.method === "POST" && req.url === "/api/auth/register") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            sum.push(JSON.parse(body));
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(sum));
        });
    }

    //PUT API
    else if (req.method === "PUT") {
        const idToEdit = Number(req.url.split("/")[1]);

        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const updatedData = sum.map((obj) =>
                obj.id === idToEdit ? JSON.parse(body) : obj
            );

            // Important: update array
            sum.length = 0;
            sum.push(...updatedData);

            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(sum));
        });
    }

    //DELETE API
    else if (req.method === "DELETE") {
        const idToDelete = Number(req.url.split("/")[1]);

        const updatedData = sum.filter((obj) => obj.id !== idToDelete);

        sum.length = 0;
        sum.push(...updatedData);

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(sum));
    }
});


server.listen(3000, () => console.log('Server is listening on port 3000'));
