// import { ProjectInput } from "./components/project-input.js"; // <-- Remove '.js' once using 'webpack
import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");

console.log("test");
