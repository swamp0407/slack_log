const dev = {
  outerurl: "https://xxxxxx.glitch.me/api/xxxxxxxxx/",
  subdir: "",
};

const prod = {
  outerurl: "https://xxxx.xx/xxxxx/api/",
  subdir: "/slacklog",
  authorize_header: "Basic xxxxxxxxx=",
};

export default process.env.NODE_ENV == "production" ? prod : dev;
