'use strict';

module.exports = function GatheringCompass(mod) {
	const CommandName = 'xyc'
	const IdMod = 2n;
	const MarkerId = 98260;

	let settings = mod.settings;
	let markers = [];

	mod.command.remove(CommandName);

	// commands
	mod.command.add(CommandName, {
		$default: x => mod.command.message(`Unknown command "${x}".`),
		reload: () => mod.loadSettings()
	})

	// event hooks
	mod.hook('S_LOAD_TOPO', 3, event => {
		mod.log(`S_LOAD_TOPO: ${event.zone} @ ${event.loc}`);
		markers = [];
	})

	mod.hook('S_SPAWN_COLLECTION', 4, event => {
		mod.log(`S_SPAWN_COLLECTION: ${event.gameId}: ${event.id} ${event.amount}x ${event.loc}`);
		addMarker(event.gameId, event.id, event.loc);
	})
	mod.hook('S_DESPAWN_COLLECTION', 2, event => {
		removeMarker(event.gameId);
	})

	// clean up
	this.destructor = () => {
		mod.command.remove(CommandName);
		markers.forEach(x => removeMarker(BigInt(x)));
	}

	function addMarker(gameId, id, loc) {
		let gatherable =
			settings.plants.find(x => x.id === id) ||
			settings.mining.find(x => x.id === id) ||
			settings.energy.find(x => x.id === id);
		if (!gatherable) return;

		mod.command.message(`Found gathering node: [${gatherable.category}] ${gatherable.name}`);
		
		loc.z -= 100;

		let marker = {
			gameId: gameId * IdMod,
			loc: loc,
			item: MarkerId,
			amount: 1,
			expiry: 300000,
			explode: false,
			masterwork: false,
			enchant: 0,
			source: 0,
			debug: false,
			owners: [{ id: 0 }]
		}
		mod.send('S_SPAWN_DROPITEM', 7, marker);
		markers.push(gameId.toString());
	}
	function removeMarker(gameId) {
		if (!markers.includes(gameId.toString())) return;

		mod.send('S_DESPAWN_DROPITEM', 4, { gameId: gameId * IdMod });
		markers.splice(markers.indexOf(gameId.toString()), 1);
	}
}