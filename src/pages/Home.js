import React from "react";
import "./home.css";

function Home({addNewThread}) {
  return (
    <section className="home-wrapper">
      <h3 className="home-title">
        Let's create a "thread" and <br /> have a conversation with AI bot.🤖
      </h3>
      <div className="new-thread" onClick={addNewThread}>
        Add New Thread
        <span>+</span>
      </div>
    </section>
  );
}

export default Home;
