export default class Block {
  /**
   * 
   * @param {object} param
   * @param {number} param.no 编号
   */
  constructor({ no }) {
    this.no = no

    this.el = document.createElement('div')
    this.release()
  }

  release() {
    this.el.style.backgroundColor = 'white'
  }

  select() {
    this.el.style.backgroundColor = 'blue'
  }

  eat() {
    this.el.style.backgroundColor = 'black'
  }

  crash() {
    this.el.style.backgroundColor = 'red'
  }
}