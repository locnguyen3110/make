const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/create-deb', upload.none(), (req, res) => {
    const { projectName, version, description } = req.body;

    // Create project directory structure
    const projectDir = path.join(__dirname, 'projects', projectName);
    if (!fs.existsSync(projectDir)){
        fs.mkdirSync(projectDir, { recursive: true });
    }

    // Example control file content
    const controlContent = `
Package: ${projectName}
Version: ${version}
Section: base
Priority: optional
Architecture: all
Depends: 
Maintainer: Your Name <youremail@example.com>
Description: ${description}
`;

    const controlPath = path.join(projectDir, 'control');
    fs.writeFileSync(controlPath, controlContent);

    // Run Theos commands to create .deb package
    exec(`cd ${projectDir} && dpkg-deb --build .`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error creating DEB package');
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('DEB package created successfully');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// mkdir deb-creator
// cd deb-creator
// npm init -y
// npm install express multer
