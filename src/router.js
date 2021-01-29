const router = require("express").Router()

const { 
    UserController,
    ProductController,
    PhoneVerificationController,
    ServerController,
    InviteController,
    BanController,
} = require("./controllers") 

const { 
    requireToken,
    tokenHandler,
    uploadImages,
} = require("./middlewares")


router.use(tokenHandler)


router.route("/api/users")
.get(UserController.list)
.post(UserController.create)

router.post("/api/check", PhoneVerificationController.check)
router.post("/api/verify", PhoneVerificationController.verify)


router.use(requireToken)


router.route("/api/users/:user_id")
.get(UserController.getByID)
.patch(UserController.update)
.delete(UserController.delete)

router.route("/api/users/:user_id/avatar")
.put(uploadImages.single("image"), UserController.setImage)

router.route("/api/servers")
.get(ServerController.list)
.post(ServerController.create)

router.route("/api/servers/:server_id")
.get(ServerController.getByID)
.patch(ServerController.update)
.delete(ServerController.delete)

router.route("/api/servers/:server_id/image")
.put(uploadImages.single("image"), ServerController.setImage)

router.route("/api/servers/:server_id/members/:member_id")
.delete(ServerController.kickMember)

router.route("/api/servers/:server_id/bans")
.get(BanController.list)
.post(BanController.banMember)

router.route("/api/servers/:server_id/bans/:ban_id")
.delete(BanController.removeBan)

router.route("/api/servers/:server_id/products")
.get(ProductController.list)
.post(ProductController.create)

router.route("/api/servers/:server_id/products/:product_id")
.get(ProductController.getByID)
.patch(ProductController.update)
.delete(ProductController.delete)

router.route("/api/servers/:server_id/products/:product_id/images")
.post(uploadImages.array("image", 8), ProductController.addImages)

router.route("/api/servers/:server_id/products/:product_id/images/:image_id")
.delete(ProductController.removeImages)

router.route("/api/invites")
.get(InviteController.list)
.post(InviteController.create)

router.route("/api/invites/:invite_code")
.get(InviteController.getByCode)
.post(InviteController.use)
.delete(InviteController.delete)

module.exports = router