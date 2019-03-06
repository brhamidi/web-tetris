class	Player
{
	constructor(socket, name)
	{
		this.socket = socket;
		this.name = name;
		this.pos = 0;
	}
}

module.exports = Player;
