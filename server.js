const express=require("express");
const mysql= require("mysql");

const app=express();
const port=3005;

const db=mysql.createConnection({
    host:"nodejs-technical-test.cm30rlobuoic.ap-southeast-1.rds.amazonaws.com",
    user:"candidate",
    password:"NoTeDeSt^C10.6?SxwY882}",
    database:"conqtvms_dev"
});

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("MySQL is connected");
});

app.get("/api/getVendorUsers", (req,res)=>{
    const{prId, custOrgId}=req.query;

    if(!prId || !custOrgId){
        return res.status(400).send("prId and custOrgId are required query parameters");
    }


    const sqlQuery=`SELECT 
    vu.VendorOrganizationId AS supplierId,
    vu.UserName,
    vu.Name
    FROM
    PrLineItems pli
    JOIN
    VendorUsers vu
    ON
    FIND_IN_SET(vu.VendorOrganizationId, pli.suppliers)
    WHERE
    pli.purchaseRequestId=?
    AND
    pli.custOrgId=?
    AND
    vu.Role = "Admin"
    GROUP BY
    vu.VendorOrganizationId, 
    vu.UserName, 
    vu.Name`;


    db.query(sqlQuery, [prId,custOrgId], (err,result)=>{
        if(err){
            console.log(err)
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
});