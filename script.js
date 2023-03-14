var axios = require('axios');
const qs = require('querystring')
const dotenv = require("dotenv")

dotenv.config()

async function getToken(params) {
    var url = 'https://iam.cloud.ibm.com/identity/token'

    var body = {
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey: params.apikey,
    }

    var config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            Authorization: 'Basic Yng6Yng=',
        },
    }

    var data = await axios.default
        .post(url, qs.stringify(body), config)
        .then((result) => {
            return result.data
        })
        .catch((err) => {
            return err
        })

    return {
        body: {
            token: data.access_token,
            refresh_token: data.refresh_token,
        },
    }
}

const scriptExportarImagen = async () => {
    let iamToken

    await getToken({
        apikey: process.env.APIKEY,
    }).then((res) => {
        iamToken = res.body.token
    })

    var data = JSON.stringify({
        "captureName": "jprina-aix-2",
        "captureDestination": "both",
        "cloudStorageImagePath": "jprina-test-bucket",
        "cloudStorageAccessKey": "18b3a089f1a647aeabf761cae53e7118",
        "cloudStorageSecretKey": "5506aa6163d031dd9664170c29177479b7a9b3a405c51b37",
        "cloudStorageRegion": "us-south"
    });

    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-south.power-iaas.cloud.ibm.com/pcloud/v2/cloud-instances/6bdf87ba-fb41-43e6-938e-fdfcb8f88ee4/pvm-instances/be8043a0-9723-4953-bf56-04a47603b9bd/capture',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + iamToken,
            'CRN': 'crn:v1:bluemix:public:power-iaas:us-south:a/e65910fa61ce9072d64902d03f3d4774:6bdf87ba-fb41-43e6-938e-fdfcb8f88ee4::'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

scriptExportarImagen()