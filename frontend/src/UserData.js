import React from "react";
import { Container, Jumbotron } from "react-bootstrap";
import "./App.css";

const user = {
  first_name: "Anthony",
  last_name: "Collini",
  username: "A_Town0789",
  email: "collini.anthony@gmail.com",
  is_admin: true,
  plans: {},
  likes: {},
};

let userPlans = [];
let userLikes = [];

for (const plan in user.plans) {
  userPlans.push(
    <div className="card my-3">
      <div className="card-body">
        <h5 className="card-title">{plan.plan_name}</h5>
        <p className="card-text">{plan.plan_url}</p>
        <div className="btn-container">
          <a href="/" className="btn btn-success">
            View submissions{" "}
          </a>
          <a href="/" className="btn btn-success">
            Edit submissions{" "}
          </a>
        </div>
        <form action="#" method="post">
          <a href="/" className="btn btn-danger">
            Delete submissions{" "}
          </a>
        </form>
      </div>
    </div>
  );
}

for (const like in user.likes) {
  userLikes.push(
    <div className="card my-3">
      <div className="card-body">
        <h5 className="card-title">{like.plan_name}</h5>
        <p className="card-text">{like.plan_url}</p>
        <a href="/plans/{{like.id}}" className="btn btn-success">
          View plan
        </a>
      </div>
    </div>
  );
}

const UserData = () => {
  return (
    <Container>
      <Jumbotron>
        <h1 className="display-4">
          Welcome back, {user.first_name} {user.last_name}
        </h1>
        <p className="lead">Your input is valuable to us!</p>
        <hr className="my-4" />
        <p className="h3">User Profile</p>
        <p>Your username: {user.username}</p>
        <p>Your email: {user.email}</p>
        <div className="btn-container">
          {user.is_admin && (
            <a className="btn btn-success" href="/admin">
              Admin module
            </a>
          )}
          <a className="btn btn-success" href="/users/profile">
            Update user information
          </a>
          <a className="btn btn-success" href="/users/changepassword">
            Change password
          </a>
        </div>
        <form action="/users/{{user.username}}/delete" method="post">
          <a className="btn btn-danger" href="/" onclick="">
            Delete user
          </a>
        </form>

        <hr className="my-4" />
        <p className="h3">New plans submitted</p>
        <br />
        <a
          className="btn btn-success mb-2"
          href="/users/{{user.username}}/plan/add"
        >
          Add new Plan
        </a>
        {userPlans.length > 0 ? (
          { userPlans }
        ) : (
          <p className="lead">No plan has been added yet!</p>
        )}

        <hr className="my-4" />
        <p className="h3">Liked plans</p>
        <br />
        {userLikes.length > 0 ? (
          { userLikes }
        ) : (
          <p className="lead">No plan liked yet!</p>
        )}
      </Jumbotron>
    </Container>
  );
};

export default UserData;
