module.exports = (sequelize, DataTypes) => {
    return sequelize.define('parties', {
        category_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        organizer_id: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
        },
        list_organizer_id: {
            type: DataTypes.TEXT,
            defaultValue: '[]',
            allowNull: false,
            get() {
                const data = this.getDataValue('list_organizer_id');
                return data ? JSON.parse(data) : [];
            },
            set(value) {
                const data = value ? JSON.stringify(value) : '[]';
                this.setDataValue('list_organizer_id', data);
            },
        },
        panel_id: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: false,
        },
        guest_list_id: {
            type: DataTypes.TEXT,
            defaultValue: '[]',
            allowNull: false,
            get() {
                const data = this.getDataValue('guest_list_id');
                return data ? JSON.parse(data) : [];
            },
            set(value) {
                const data = value ? JSON.stringify(value) : '[]';
                this.setDataValue('guest_list_id', data);
            },
        },
    });
};