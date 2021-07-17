import { readdirSync, mkdirSync, writeFileSync, readFileSync } from 'fs';

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

export const generate = args => {
  const componentName = args
    ?.find(arg => arg.includes('name='))
    ?.split('=')[1];

  if (!componentName) {
    throw new Error('Component name must be provided');
  } else if (componentName.length > 35) {
    throw new Error('Component name must be 35 characters or less');
  }

  const formattedName =
    componentName[0].toUpperCase() + componentName.slice(1).toLowerCase();

  const componentDir = './src/components';
  const existingDirectories = getDirectories(componentDir);
  const newComponentDir = `${componentDir}/${formattedName}`;

  if (existingDirectories.includes(formattedName)) {
    throw new Error(
      'This component name already exists. Please choose a different name.',
    );
  }

  mkdirSync(newComponentDir);

  writeFileSync(`${newComponentDir}/styles.module.css`, '.main {\n}\n');

  writeFileSync(
    `${newComponentDir}/index.js`,
    `export * from './${formattedName}';\n`,
  );

  writeFileSync(
    `${newComponentDir}/${formattedName}.js`,
    `import styles from './styles.module.css';\n\nexport const ${formattedName} = () => {\n  return <div className={styles.main}>${formattedName}</div>;\n};\n`,
  );

  const strBuffer = readFileSync('./src/components/index.js');

  const indexContents = strBuffer
    .toString()
    .split('\n')
    .filter(each => each);

  const updatedContents = [
    ...indexContents,
    `export * from './${formattedName}';`,
  ].sort((a, b) => a.length - b.length);

  writeFileSync('./src/components/index.js', updatedContents.join('\n'));
};
