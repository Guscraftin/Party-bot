module.exports = (sequelize, DataTypes) => {
    return sequelize.define("parties", {
        category_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        panel_organizer_id: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: false,
        },
        channel_organizer_only: {
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },
        channel_without_organizer: {
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },
        channels_locked_id: {
            type: DataTypes.TEXT,
            defaultValue: "[]",
            allowNull: false,
            get() {
                const data = this.getDataValue("channels_locked_id");
                return data ? JSON.parse(data) : [];
            },
            set(value) {
                const data = value ? JSON.stringify(value) : "[]";
                this.setDataValue("channels_locked_id", data);
            },
        },
        organizer_id: {
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },
        organizer_list_id: {
            type: DataTypes.TEXT,
            defaultValue: "[]",
            allowNull: false,
            get() {
                const data = this.getDataValue("organizer_list_id");
                return data ? JSON.parse(data) : [];
            },
            set(value) {
                const data = value ? JSON.stringify(value) : "[]";
                this.setDataValue("organizer_list_id", data);
            },
        },
        guest_list_id: {
            type: DataTypes.TEXT,
            defaultValue: "[]",
            allowNull: false,
            get() {
                const data = this.getDataValue("guest_list_id");
                return data ? JSON.parse(data) : [];
            },
            set(value) {
                const data = value ? JSON.stringify(value) : "[]";
                this.setDataValue("guest_list_id", data);
            },
        },
    });
};