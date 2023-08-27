import { join, parse } from "https://deno.land/std@0.200.0/path/mod.ts";
import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";

const hello = new Command()
	.description("Say hello.")
	.action(() => {
		console.log("Hello!");
	});

const base = new Command().default("hello");

const pluginsDir = join(".", "plugins");
for (const file of Deno.readDirSync(pluginsDir)) {
	if (file.isFile) {
		const pluginPath = import.meta.resolve(
			new URL(join(pluginsDir, file.name), import.meta.url).href,
		);

		const plugin = await import(pluginPath);
		const name = parse(file.name).name;
		base.command(name, plugin.default);
	}
}

await base
	.command("hello", hello, true)
	.parse(Deno.args);
