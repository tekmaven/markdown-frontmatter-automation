import fs from 'fs';
import matter from 'gray-matter';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'


const isEsp32 = (fileContents) => {
  return fileContents.indexOf("esp32:") > 0 || fileContents.indexOf("board: esp32") > 0
};

const isEsp8266 = (fileContents) => {
  return fileContents.indexOf("esp32:") > 0 || fileContents.indexOf("board: esp32") > 0
};



const mdFiles = globSync('/home/ryan/Projects/esphome-devices/src/docs/devices/**/*.md');
mdFiles.forEach(fullPath => {
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const frontmatter = matterResult.data;

  if(frontmatter.board) {
    return;
  }

  const lowerContent = matterResult.content.toLowerCase();
  const fileLines = fileContents.split("\n");
  const endOfFrontmatter = fileLines.indexOf("---", fileLines.indexOf("---") + 1);

  if(lowerContent.indexOf("esp32") > 0 && lowerContent.indexOf("esp8266") > 0) {
    console.log(fullPath, "???")
  }

  else if(lowerContent.indexOf("esp32") > 0) {
    console.log(fullPath, "esp32");
    fileLines[endOfFrontmatter] = "board: esp32\n---";
    const newFile = fileLines.join("\n");
    fs.writeFileSync(fullPath, newFile);
  }

  else if(lowerContent.indexOf("esp8266") > 0) {
    console.log(fullPath, "esp8266");
    fileLines[endOfFrontmatter] = "board: esp8266\n---";
    const newFile = fileLines.join("\n");
    fs.writeFileSync(fullPath, newFile);
  }

  else {
    console.log(fullPath, "NO MATCH");
  }
});