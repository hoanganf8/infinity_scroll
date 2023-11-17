import { client } from "./client.js";
import { config } from "./config.js";
const app = {
  query: {
    _limit: config.PAGE_LIMIT,
    _page: 1,
  },
  _next: false,
  _offsetScroll: 0,
  render: function (posts) {
    const entites = (html) =>
      html.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const root = document.querySelector(".posts");
    root.innerHTML = `${posts.map(
      ({ title, content }) => `<div class="post">
        <h2>${entites(title)}</h2>
        ${content}
    </div>`,
    )}`;
    this.addEvent();
  },
  getPosts: async function () {
    const queryString = new URLSearchParams(this.query).toString();
    const { data } = await client.get("/posts?" + queryString);
    this.render(data);
  },
  addEvent: function () {
    const documentHeight = document.body.clientHeight;
    const _this = this;
    window.onscroll = function () {
      const y = this.scrollY - _this._offsetScroll;

      if (!_this._next && y >= (documentHeight * 50) / 100) {
        _this.query._limit += config.PAGE_LIMIT;
        _this._next = true;
        _this.getPosts();
        _this._offsetScroll = y;
        _this._next = false;
      }
    };
  },
  start: function () {
    this.getPosts();
  },
};
app.start();
