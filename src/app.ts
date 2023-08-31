// 3 Forward slashes is a typescript special syntax. Not in js
// add path to the file needed to import
// ! Be careful using these. Need to check tsconfig.json for "module": "commonjs" to "module": "amd"
// * Also check <script src="dist/bundle.js" defer></script> in html
///<reference path="components/project-input.ts"/>
///<reference path="components/project-list.ts"/>

namespace App {
    new ProjectInput();
    new ProjectList("active");
    new ProjectList("finished");
}
