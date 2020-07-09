const Sequelize = require('sequelize');

const Model = Sequelize.Model;

class Calendar extends Model {

}

class CalendarUrl extends Model {

}

class CalendarCourse extends Model {

}

module.exports = (sequelize) => {
    Calendar.init({
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'calendar',
    });

    CalendarUrl.init({
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        value: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'calendarUrl',
    });

    CalendarCourse.init({
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        value: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        error: {
            type: Sequelize.BOOLEAN,
            default: false,
        }
    }, {
        sequelize,
        modelName: 'calendarCourse',
    });

    Calendar.hasMany(CalendarUrl, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    Calendar.hasMany(CalendarCourse, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    return [Calendar, CalendarUrl, CalendarCourse];
};
