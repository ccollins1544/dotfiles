process.env.DOTENV_LOADED || require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const path = require("path");
const colors = require("colors");
const fs = require("fs");
const utils = require("../utils");

/**
 * init
 * Will set up and configure the following
 * - Database
 * - jsonwebtoken
 * - Downloads Directory
 * - FontAwesome
 * - Adobe PDFTools
 */

const init = async () => {
  let exit_code = 1;
  let counter = 0;

  // =====================[ Database ]===========================================
  // Config for Database
  if (!fs.existsSync(path.resolve(__dirname, "../config/config.json")) || !utils.deepEqual(require("../config"), require("../config/config.json"))) {
    console.log("===============[ Generate config for database ]===================".yellow);
    await utils.generateConfig();
    counter++;
  }

  // =====================[ jsonwebtoken ]===========================================
  // Keys for jsonwebtoken
  if (!fs.existsSync(path.resolve(__dirname, "../public.pem")) || !fs.existsSync(path.resolve(__dirname, "../private.pem"))) {
    console.log("===============[ Generate Keys for Auth ]=========================".yellow);
    await utils.generateKeysAndSave();
    counter++;
  }

  // =====================[ Downloads Directory ]===========================================
  const downloads_dir = process.env.DOWNLOADS;
  if (!fs.existsSync(path.resolve(__dirname, `../${downloads_dir}`))) {
    fs.mkdirSync(path.join(__dirname, `../${downloads_dir}`), (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`Directory ${path.resolve(__dirname, `../${downloads_dir}`)} created successfully!`.green);
    });

    counter++;
  }

  // =====================[ NPMRC File ]===========================================
  // NPMRC File 
  const npmrcFile = "../.npmrc";
  if (!fs.existsSync(path.resolve(__dirname, npmrcFile))) {
    const DOT_NPMRC = `scripts-prepend-node-path=true`;

    try {
      await fs.writeFileSync(path.resolve(__dirname, npmrcFile), DOT_NPMRC);
      console.log(`File ${npmrcFile} created successfully!`.green);
    } catch (error) {
      console.log("============[ error ]==============".red);
      console.log(error);
      console.log("========================================".red);
    }

    counter++;
  }

  // React NPMRC File for FontAwesome
  const react_npmrcFile = "../views/.npmrc";
  if (!fs.existsSync(path.resolve(__dirname, react_npmrcFile))) {
    const DOT_NPMRC = `@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=${process.env.FONTAWESOME_AUTH_TOKEN}`;

    try {
      await fs.writeFileSync(path.resolve(__dirname, react_npmrcFile), DOT_NPMRC);
      console.log(`File ${react_npmrcFile} created successfully!`.green);
    } catch (error) {
      console.log("============[ error ]==============".red);
      console.log(error);
      console.log("========================================".red);
    }

    counter++;
  }

  // =====================[ Adobe PDFTools ]===========================================
  const pdftools_api_credentials_file = path.resolve(__dirname, `../${process.env.PDFTOOLS_API_CREDENTIALS_FILE}`);
  const PDFTOOLS_API_CREDENTIALS = {
    "client_credentials": {
      "client_id": process.env.PDFTOOLS_CLIENT_ID,
      "client_secret": process.env.PDFTOOLS_CLIENT_SECRET
    },
    "service_account_credentials": {
      "organization_id": process.env.PDFTOOLS_ORGANIZATION_ID,
      "account_id": process.env.PDFTOOLS_ACCOUNT_ID,
      "private_key_file": process.env.PDFTOOLS_PRIVATE_KEY_FILE
    }
  }

  // Generate Private Key File
  if (process.env.PDFTOOLS_PRIVATE_KEY_FILE !== undefined && !fs.existsSync(path.resolve(__dirname, `../${process.env.PDFTOOLS_PRIVATE_KEY_FILE}`)) && process.env.PDFTOOLS_PRIVATE_KEY_FILE_CONTENTS !== undefined) {
    console.log(`===============[ Generating ${process.env.PDFTOOLS_PRIVATE_KEY_FILE} for Adobe PDFTools ]===================`.yellow);
    try {
      await fs.writeFileSync(process.env.PDFTOOLS_PRIVATE_KEY_FILE, process.env.PDFTOOLS_PRIVATE_KEY_FILE_CONTENTS.replace(/\\n/g, '\n'));
      console.log(`File ${process.env.PDFTOOLS_PRIVATE_KEY_FILE} created successfully!`.green);
    } catch (error) {
      console.log("============[ error ]==============".red);
      console.log(error);
      console.log("===================================".red);
    }

    counter++;

  } else if (process.env.PDFTOOLS_PRIVATE_KEY_FILE === undefined || (process.env.PDFTOOLS_PRIVATE_KEY_FILE !== undefined && !fs.existsSync(path.resolve(__dirname, `../${process.env.PDFTOOLS_PRIVATE_KEY_FILE}`)))) {
    console.log("============[ MISSING FILE ]==============".yellow);
    console.log("Please add the env variable PDFTOOLS_PRIVATE_KEY_FILE_CONTENTS and set it equal to the contents of what PDFTOOLS_PRIVATE_KEY_FILE should be.".cyan);
    console.log("You can set the entire contents of the key file to a variable by making it all one line using \\n for every new line.".cyan);
    console.log(`## Authentication Setup

The credentials file and corresponding private key file for the samples is ${pdftools_api_credentials_file} and ${process.env.PDFTOOLS_PRIVATE_KEY_FILE}
respectively. Before the samples can be run, replace both the files with the ones present in the downloaded zip file at 
the end of creation of credentials via [Get Started](https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html?ref=getStartedWithServicesSdk) workflow.

The SDK also supports providing the authentication credentials at runtime, without storing them in a config file. Please
refer this [section](#create-a-pdf-file-from-a-docx-file-by-providing-in-memory-authentication-credentials) to 
know more.`.yellow);
    console.log("==========================================".yellow);
  }

  // Generate Config File 
  if (!fs.existsSync(pdftools_api_credentials_file) || !utils.deepEqual(PDFTOOLS_API_CREDENTIALS, require(pdftools_api_credentials_file))) {
    console.log("===============[ Generate config for Adobe PDFTools ]===================".yellow);
    try {
      await fs.writeFileSync(pdftools_api_credentials_file, JSON.stringify(PDFTOOLS_API_CREDENTIALS, null, 2));
      console.log(`File ${pdftools_api_credentials_file} created successfully!`.green);
    } catch (error) {
      console.log("============[ error ]==============".red);
      console.log(error);
      console.log("===================================".red);
    }

    counter++;
  }

  if (counter >= 0) {
    exit_code = 0;
  }

  console.log(`_______________ ${counter} init commands ran ______________________________`.green);
  process.exit(exit_code);
}

init();
