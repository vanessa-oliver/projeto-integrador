const { Sequelize, DataTypes } = require('sequelize');
const sq = require('../config/database.js');

const Disciplina = sq.sequelize.define('Disciplina', {
    cod_disc: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome_disc: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
});

module.exports = Disciplina;