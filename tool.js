import fs from 'fs';
import matter from 'gray-matter';
import { globSync } from 'glob';


const isEsp32 = (fileContents) => {
  return fileContents.indexOf("esp32:") > 0 || fileContents.indexOf("platform: esp32") > 0
};

const isEsp8266 = (fileContents) => {
  return fileContents.indexOf("esp8266:") > 0 || fileContents.indexOf("platform: esp8266") > 0
};

const addToFrontMatter = (fileLines, lineSeperator, key, value) => {
  const frontmatterSeperator = "---";
  const endOfFrontmatter = fileLines.indexOf(frontmatterSeperator, fileLines.indexOf(frontmatterSeperator) + 1);
  fileLines[endOfFrontmatter] = `${key}: ${value}${lineSeperator}${fileLines[endOfFrontmatter]}`;
};

const writeLinesToFile = (fileLines, lineSeperator, fullPath) => {
  const newFile = fileLines.join(lineSeperator);
  fs.writeFileSync(fullPath, newFile);
};

const mdFiles = globSync('/home/ryan/Projects/esphome-devices/src/docs/devices/**/*.md');
mdFiles.forEach(fullPath => {
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const frontmatter = matterResult.data;

  if(frontmatter.board) {
    console.log(fullPath, "✅")
    return;
  }

  const lowerContent = matterResult.content.toLowerCase();
  let lineSeperator = "\n";
  let fileLines = fileContents.split(lineSeperator);
  if(fileLines[0].indexOf("\r") > 0) {
    lineSeperator = "\r\n";
    fileLines = fileContents.split(lineSeperator);
  }

  const isEsp32Board = isEsp32(lowerContent);
  const isEsp8266Board = isEsp8266(lowerContent);
  
  if(isEsp32Board && isEsp8266Board) {
    console.log(fullPath, "skipping, both")
  }

  else if(isEsp32Board) {
    console.log(fullPath, "esp32");
    addToFrontMatter(fileLines, lineSeperator, "board", "esp32");
    writeLinesToFile(fileLines, lineSeperator, fullPath);
  }

  else if(isEsp8266Board) {
    console.log(fullPath, "esp8266");
    addToFrontMatter(fileLines, lineSeperator, "board", "esp8266");
    writeLinesToFile(fileLines, lineSeperator, fullPath);
  }

  else {
    console.log(fullPath, "NO MATCH");
  }
});
