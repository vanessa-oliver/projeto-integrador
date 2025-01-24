const { Sequelize, DataTypes } = require('sequelize');
const sq = require('../config/database.js');

const QuestaoProva = sequelize.sequelize.define('QuestaoProva', { 
    cod_prova: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { 
            model: Prova, 
            key: 'cod_prova' 
        } 
    }, 
    cod_questao: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: 
        {   model: Questao, 
            key: 'cod_questao' 
        } 
    } 
}, 
{ primaryKey: 
    ['cod_prova',
     'cod_questao'] 
});