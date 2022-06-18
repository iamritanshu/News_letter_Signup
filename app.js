const express = require('express');
const app = express();
const https = require('https');


// Parsing css and images to server via a public folder
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {

    const firstName = req.body.fName;
    const secondName = req.body.sName;
    const email = req.body.eName;

    // console.log(firstName, secondName, email);

    
    // Creating own json data
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: secondName
                }
            }
        ]
    };


    // Converting data into string
    const jsonData = JSON.stringify(data);

    const url = 'https://us11.api.mailchimp.com/3.0/lists/fe5d1c0f23';

    const options = {
        method: "POST",
        auth: "angela1:25c4b350b622aa1642e796638bad62e7-us11"
    }

    
    // Parsing http request
    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        // Resposing data 
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    // Writing data over web
    request.write(jsonData);
    request.end();

});


// Posting failure data in web
app.post("/failure", (req, res) => {
    res.redirect("/");
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

//25c4b350b622aa1642e796638bad62e7-us11

//fe5d1c0f23