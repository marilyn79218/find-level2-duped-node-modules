const { lstatSync, readdirSync, existsSync, writeFile } = require('fs');
const path = require('path');
const packageJson = require('../package');
const dependencies = Object.keys(packageJson.dependencies);

// const dependencyKeys = Object.keys(dependencies);
const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const getModuleName = modulePath => modulePath.split('/').pop();

// const innerPackages = getDirectories('../node_modules');
// console.log('innerPackages', Array.isArray(innerPackages));

const nestedModules = dependencies.reduce((pV, cV) => {
  const nestedModulesPath = path.resolve(`../node_modules/${cV}/node_modules`);
  if (existsSync(nestedModulesPath)) {
    const nestedPackageNames = getDirectories(nestedModulesPath)
      .filter(path => !path.includes('.bin'))
      .map(path => getModuleName(path));

    return {
      ...pV,
      [cV]: pV[cV] ? [...pV[cV], ...nestedPackageNames] : [...nestedPackageNames],
    }
  }

  return pV;
}, {});
console.log('------- Nested Modules -------', nestedModules);


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


