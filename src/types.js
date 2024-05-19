class DataType {
  constructor (value) {
    this.value = value
  }

  getValue () {
    return this.value
  }

  render () {
    return this.value
  }
}

export class LanguageDataType extends DataType{
  content = null
  language = ""
  constructor (content, language) {
    super(content)
    this.language = language
  }
  render () {
    return this.content.render() + this.language
  }
}

export class Iri extends DataType {
  constructor (value) {
    super(value)
  }

  render () {
    return `<${this.value}>`
  }
}

export class Literal extends DataType {
  constructor (value) {
    super(value)
  }

  render () {
    return `"${this.value}"`
  }
}
export class BlankNode extends DataType {
  constructor (value) {
    super(value)
  }

  render () {
    return `_:${this.value}`
  }
}
