import { defineStore } from 'pinia';

export const useGroupStore = defineStore('groupStore', {
  state: () => ({
    groups: [
      {
        name: 'Iggies Club',
        description:
          'A place for iggies to invest in the funding rounds of promising projects.',
        image: 'https://www.iguanadex.com/assets/logo-dark-a5132faa.webp',
        link: 'https://docs.iguanadex.com',
        DEFAULT_ADMIN: '0xD42fCD4CBBC73a93655f955f3D3A4475049A9A27',
        bsc: '0xf98cF0B7a14b8d90770c0128DA404877277Af58A',
        polygon: '0x123',
        arbitrum: '0x123',
        optimism: '0x123',
        avax: '0x123',
        ethereum: '0x123',
        isMember: true,
      },
    ],
  }),
  getters: {
    ownGroups() {
      return this.groups.filter(t => t.isMember);
    },
    ownGroupCount() {
      return this.groups.reduce((p, c) => {
        return c.isMember ? p + 1 : p;
      }, 0);
    },
    totalGroupCount: state => {
      return state.groups.length;
    },
  },
  actions: {
    refreshGroups(_groups) {
      this.groups = _groups;
    },
    addGroup(_group) {
      this.groups.push(_group);
    },
    deleteGroup(_name) {
      this.groups = this.groups.filter(t => {
        return t.name !== _name;
      });
    },
    updateGroupMetadata(_name, _description, _image, _link) {
      const group = this.groups.find(t => t.name === _name);

      if (group) {
        if (typeof _description !== 'undefined') {
          group.description = _description;
        }
        if (typeof _image !== 'undefined') {
          group.image = _image;
        }
        if (typeof _link !== 'undefined') {
          group.link = _link;
        }
      }
    },
    updateGroupAddresses(_name, _network, _newAddress) {
      const group = this.groups.find(t => t.name === _name);

      if (group) {
        group[_network] = _newAddress;
      }
    },
    updateGroupMembership(_name) {
      const group = this.groups.find(t => t.name === _name);

      if (group) {
        group.isMember = !group.isMember;
      }
    },
  },
});
