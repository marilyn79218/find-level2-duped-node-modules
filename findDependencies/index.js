const fs = require('fs');
const path = require('path');
const packageJson = require('../package');
const dependencies = Object.keys(packageJson.dependencies);

// const dependencyKeys = Object.keys(dependencies);
const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source =>
  fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const getModuleName = modulePath => modulePath.split('/').pop();

const level2ModuleUsageList = {};
dependencies.map(dependency => {
  const nestedModulesPath = path.resolve(`../node_modules/${dependency}/node_modules`);
  if (fs.existsSync(nestedModulesPath)) {
    const nestedPackageNames = getDirectories(nestedModulesPath)
      .filter(path => !path.includes('.bin'))
      .map(path => {
        const moduleName = getModuleName(path);
        const version = require(`${path}/package.json`).version;
        return `${moduleName}-${version}`;
      });

    nestedPackageNames.forEach(nestedPackageName => {
      if (!level2ModuleUsageList[nestedPackageName]) level2ModuleUsageList[nestedPackageName] = [dependency];
      else level2ModuleUsageList[nestedPackageName].push(dependency);
    })
  }
});
console.log('------- Level 2 Modules Usage List -------', level2ModuleUsageList);


// const appendData = (targetPath, data) => {
//   if (!existsSync(targetPath)) {
//     writeFile(targetPath, '', function(err) {
//       if(err) throw err;    
//       console.log("The file was saved!");
//     });
//   }

//   appendFile(targetPath, data, function (err) {
//     if (err) throw err;
//     console.log('Appended!');
//   });
// }

// innerPackages.forEach(packagePath => {
//   const innerModulePaths = `${packagePath}/node_modules`;
//   const nestedPackage = 
// });


