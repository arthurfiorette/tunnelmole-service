import fs from 'fs';
import toml from 'toml';

const configPath = fs.existsSync('config-instance.toml') ? 'config-instance.toml' : 'config-instance.example.toml';
let config = toml.parse(fs.readFileSync(configPath).toString());

export default config;
