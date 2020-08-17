db = db.getSiblingDB("bb-db");
db.user.drop();

db.user.save( {
    email : "tai.truong@bebuy.vn"
});