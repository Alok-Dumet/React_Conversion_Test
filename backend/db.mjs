import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater'
import passportLocalMongoose from 'passport-local-mongoose';

//lets me use slugs
mongoose.plugin(slug);

//Users that can create an account with general requirements like username, password, email, and optionally a cashApp and references to campaigns they may or may not make
const UserSchema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,  //I need to add a custom error message for this later
    minLength:[5, "Username must be atleast 5 characters long"],
    maxLength: [36, "Username cannot be greater than 36 characters"],
    required:[true, "Username is required"]
  },
  email: {
    type:String, minLength:[3, "Email must be a valid"],
    // validate: {validator}, //later implement validation to check if it has @ in it
    required:[true, "Email is required"]
  },
  cashApp: {
    type:String,     //not safe fake links can be added but IDK how to implement link validation
  },
  socialMedia: [{
    type:String,     //not safe fake links can be added but IDK how to implement link validation
    required:[true, "DO NOT ADD AN EMPTY WEBSITE"]
  }],
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: [true, "DO NOT ADD AN EMPTY CAMPAIGN"]
  }],
  slug:{
    type: String,
    slug: "userName",
    unique: true,
    slugPaddingSize: 10
  }
});

//Campaign that has a name, renown (an upvote mechanic), password, and creator
//Optionally there are/is description, tags (describe genre and other details), references to players, and references to campaign elements
//Password is only needed if a user wishes to join the game and be able to interact with their character and etc. Viewers do not need password. Everyone can by default see elements the dungeon master allows
//DungeonMaster does not need a password. Players are identified by logging in and have edit permissions on CampaignElements the DungeonMaster allows them to have
//People who renown the campaign are tracked so that the same person cannot give multiple renown to a single campaign and so they can unlike later if they wish
const CampaignSchema = mongoose.Schema({
  campaignName: {
    type: String,
    maxLength: [69, "Name cannot be greater than {MAX} characters"],
    required:[true, "Campaign Name is required"]
  },
  renown: {
    type:Number,
    default: 0,
    required: [true, "Error Occured Making Renown. Should Be Default To 0"]
  },
  campaignPassword: {
    type:String,
    minLength:[5, "Password must be atleast 5 characters long"],
    required:[true, "Campaign Password is required"]
  },
  dungeonMaster:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Error Occured Assigning Dungeon Master. There Should Be A Dungeon Master"]
  },
  mainStory:[{
    type: String,
    required: [true, "You did not add any text"]
      }],
  description: {
    type:String,
    maxLength:[420, "Description cannot be greater than 420 characters"]
  },
  tags: [{
    type: String,
    maxLength: [20, "Tag cannot be greater than 20 characters"]
  }],
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "DO NOT ADD AN EMPTY USER"]
  }],
  renownSpreaders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "DO NOT ADD AN EMPTY USER"]
  }],
  campaignElements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CampaignElement",
    required: [true, "DO NOT ADD AN EMPTY CAMPAIGNELEMENT"]
  }],
  slug:{
    type: String,
    slug: "campaignName",
    unique: true,
    slugPaddingSize: 10
  }
});

//An element must be declared a type (for convenience)
//The creator may or may not want to reveal an element or allow edit access to an element.
//By default all elements are viewable and non-modificable. People in the canSee and canEdit list can bypass the default
//An element may have text and images
const CampaignElementSchema = mongoose.Schema({
  elementType: {
    type: String,
    enum: ["item", "location", "character", "enemy", "player"],
    required: true
  },
  private:{
    type: Boolean,
    default: false,
    required: [true, "You must determine if the element is default viewable to all"]
  },
  canSee: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "DO NOT ADD AN EMPTY USER"]
  }],
  canEdit: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "DO NOT ADD AN EMPTY USER"]
  }],
  elementText: {
    type: String,
    default: false
  },
  images: [{
    type: String,
    required: [true, "DO NOT ADD AN EMPTY LINK"]
  }]
});

//Extends my User model to have methods from passportLocalMongoose. These include User.authenticate/serialize/deserialize/register
//specify my username field as userName (I'm just making things inconvenient for myself because I like camelCase)
UserSchema.plugin(passportLocalMongoose, {usernameField: "userName"});

//my models
mongoose.model("User", UserSchema);
mongoose.model("Campaign", CampaignSchema);
mongoose.model("CampaignElement", CampaignElementSchema);

//my connection string
mongoose.connect(process.env.DSN ?? "mongodb://127.0.0.1:27017/LocalParroTavern");