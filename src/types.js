class DataType {
    constructor(value) {
        this.value = value
    }

    getValue() {
        return this.value
    }

    render() {
        return this.value
    }
}

export class Iri extends DataType {
    constructor(value) {
        super(value)
    }

    render() {
        if (this.value === undefined) {
            return undefined
        }
        return `<${this.value}>`
    }
}
export class Literal extends DataType {
    constructor(value) {
        super(value)
    }

    render() {
        if (this.value === undefined) {
            return undefined
        }
        return `"${this.value}"`
    }
}

export class DataTypedLiteral extends Literal {

    constructor(value, datatype) {
        super(value)
        this.datatype = datatype
    }
    render() {
        return super.render() + '^^' + "<"  + this.datatype + ">"
    }
}

export class LanguageLiteral extends Literal {
    constructor(value, language) {
        super(value)
        this.language = language
    }
    render() {
        return super.render() + '@' + this.language
    }
}
export class BlankNode extends DataType {
    constructor(value) {
        super(value)
    }

    render() {
        return `_:${this.value}`
    }
}
