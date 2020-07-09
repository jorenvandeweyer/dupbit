const Sequelize = require('sequelize');

const Model = Sequelize.Model;

class SongRaw extends Model {

}

class Song extends Model {

}

class Playlist extends Model {

}

class SongInPlaylist extends Model {

}

module.exports = (sequelize) => {
    SongRaw.init({
        filename: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        provider: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'UNKNOWN',
        },
        cached: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        downloads: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    }, {
        sequelize,
        modelName: 'songRaw',
        name: {
            singular: 'songRaw',
            plural: 'songsRaw',
        },
        tableName: 'songsRaw',
    });

    Song.init({
        title: {
            type: Sequelize.STRING,
        },
        artist: {
            type: Sequelize.STRING,
        }
    }, {
        sequelize,
        modelName: 'song',
    });

    Playlist.init({
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'playlist',
        name: {
            singular: 'playlist',
            plural: 'playlists',
        }
    });

    SongInPlaylist.init({

    }, {
        sequelize,
        modelName: 'songInPlaylist',
        name: {
            singular: 'songInPlaylist',
            plural: 'songsInPlaylists',
        },
        tableName: 'songsInPlaylists',
    });

    SongRaw.hasMany(Song, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: 'srid',
    });

    Song.hasMany(SongInPlaylist, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: 'sid',
    });

    Playlist.hasMany(SongInPlaylist, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: 'pid',
    });

    return [SongRaw, Song, Playlist, SongInPlaylist];

};
