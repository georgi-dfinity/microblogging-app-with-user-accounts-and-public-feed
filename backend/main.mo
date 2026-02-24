import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply migration function from migration module
actor {
  type Topic = {
    #random;
    #politics;
    #tech;
  };

  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile type with username
  public type UserProfile = {
    username : Text;
  };

  // Persistent map for user profiles
  let profiles = Map.empty<Principal, UserProfile>();

  // Post type with author, topic, and timestamp
  public type Post = {
    author : Principal;
    content : Text;
    topic : Topic;
    timestamp : Time.Time;
  };

  // Module for Post comparison (newest first)
  module Post {
    public func compare(post1 : Post, post2 : Post) : Order.Order {
      if (post1.timestamp > post2.timestamp) #less else
      if (post1.timestamp < post2.timestamp) #greater else {
        Text.compare(post1.content, post2.content);
      };
    };
  };

  // Persistent map for posts
  let postMap = Map.empty<Time.Time, Post>();

  // Get current user's profile (requires at least user role)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their profile");
    };
    profiles.get(caller);
  };

  // Get any user's profile with proper access control
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  // Get any user's username (public access)
  public query ({ caller }) func getUsername(user : Principal) : async ?Text {
    switch (profiles.get(user)) {
      case (null) { null };
      case (?profile) { ?profile.username };
    };
  };

  // Save current user's profile (user role required)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public shared ({ caller }) func createPost(content : Text, topic : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    // Validate content length
    if (content.size() == 0 or content.size() > 280) {
      Runtime.trap("Invalid post: content must be between 1 and 280 characters");
    };

    // Validate and convert topic
    let validTopic = switch (topic) {
      case ("random") { #random };
      case ("politics") { #politics };
      case ("tech") { #tech };
      case (_) { Runtime.trap("Invalid topic: must be 'random', 'politics', or 'tech'") };
    };

    let post : Post = {
      author = caller;
      content;
      topic = validTopic;
      timestamp = Time.now();
    };

    postMap.add(post.timestamp, post);
  };

  public query ({ caller }) func getPublicFeed() : async [Post] {
    // No authorization check - accessible to guests
    let posts = postMap.values().toArray();
    posts.sort();
  };
};
