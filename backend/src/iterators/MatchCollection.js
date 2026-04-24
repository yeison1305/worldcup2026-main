// Patrón de diseño: Iterator (GoF)
// Permite recorrer colecciones de partidos de forma estandarizada,
// encapsulando la lógica de filtrado sin exponer la estructura interna.

/**
 * MatchFilterIterator — Concrete Iterator
 * Recorre partidos aplicando un filtro configurable.
 * Implementa el protocolo Iterator de JavaScript (next() → { value, done }).
 */
class MatchFilterIterator {
  constructor(matches, filterFn = () => true) {
    this._matches = matches;
    this._filterFn = filterFn;
    this._index = 0;
  }

  /**
   * Avanza al siguiente elemento que cumple el filtro
   * @returns {{ value: object|undefined, done: boolean }}
   */
  next() {
    while (this._index < this._matches.length) {
      const match = this._matches[this._index++];
      if (this._filterFn(match)) {
        return { value: match, done: false };
      }
    }
    return { value: undefined, done: true };
  }

  /**
   * Verifica si hay más elementos sin consumir
   * @returns {boolean}
   */
  hasNext() {
    let tempIndex = this._index;
    while (tempIndex < this._matches.length) {
      if (this._filterFn(this._matches[tempIndex])) {
        return true;
      }
      tempIndex++;
    }
    return false;
  }

  /** Permite usar for...of sobre el iterador */
  [Symbol.iterator]() {
    return this;
  }

  /**
   * Encadena un filtro adicional — crea un nuevo iterador con filtro combinado
   * @param {string} groupLetter - Letra del grupo (A, B, C, D...)
   * @returns {MatchFilterIterator}
   */
  filterByGroup(groupLetter) {
    const remaining = this._collectRemaining();
    return new MatchFilterIterator(
      remaining,
      (m) => m.group_letter?.trim() === groupLetter
    );
  }

  /**
   * Filtra por estado del partido
   * @param {string} status - SCHEDULED | LIVE | FINISHED
   * @returns {MatchFilterIterator}
   */
  filterByStatus(status) {
    const remaining = this._collectRemaining();
    return new MatchFilterIterator(
      remaining,
      (m) => m.status === status
    );
  }

  /**
   * Filtra por jornada/ronda
   * @param {number} round - Número de jornada
   * @returns {MatchFilterIterator}
   */
  filterByRound(round) {
    const remaining = this._collectRemaining();
    return new MatchFilterIterator(
      remaining,
      (m) => m.round_number === round
    );
  }

  /**
   * Recolecta todos los elementos restantes que cumplen el filtro actual
   * @returns {object[]}
   */
  _collectRemaining() {
    const items = [];
    // Reset para recolectar desde el inicio con el filtro actual
    for (const match of this._matches) {
      if (this._filterFn(match)) {
        items.push(match);
      }
    }
    return items;
  }

  /**
   * Convierte el iterador a un array (consume todos los elementos)
   * @returns {object[]}
   */
  toArray() {
    const result = [];
    let item = this.next();
    while (!item.done) {
      result.push(item.value);
      item = this.next();
    }
    return result;
  }
}

/**
 * MatchCollection — Iterable Aggregate
 * Encapsula una colección de partidos y provee métodos factory
 * para crear iteradores filtrados.
 */
class MatchCollection {
  constructor(matches = []) {
    this._matches = [...matches];
  }

  /** Cantidad de partidos en la colección */
  get size() {
    return this._matches.length;
  }

  /**
   * Iterador por defecto — recorre todos los partidos
   * @returns {MatchFilterIterator}
   */
  [Symbol.iterator]() {
    return new MatchFilterIterator(this._matches);
  }

  /**
   * Crea un iterador que filtra partidos por grupo
   * @param {string} groupLetter
   * @returns {MatchFilterIterator}
   */
  filterByGroup(groupLetter) {
    return new MatchFilterIterator(
      this._matches,
      (m) => m.group_letter?.trim() === groupLetter
    );
  }

  /**
   * Crea un iterador que filtra partidos por estado
   * @param {string} status
   * @returns {MatchFilterIterator}
   */
  filterByStatus(status) {
    return new MatchFilterIterator(
      this._matches,
      (m) => m.status === status
    );
  }

  /**
   * Crea un iterador que filtra partidos por jornada
   * @param {number} round
   * @returns {MatchFilterIterator}
   */
  filterByRound(round) {
    return new MatchFilterIterator(
      this._matches,
      (m) => m.round_number === round
    );
  }

  /**
   * Crea un iterador con un filtro personalizado
   * @param {function} filterFn
   * @returns {MatchFilterIterator}
   */
  filter(filterFn) {
    return new MatchFilterIterator(this._matches, filterFn);
  }

  /**
   * Agrega un partido a la colección
   * @param {object} match
   */
  add(match) {
    this._matches.push(match);
  }
}

module.exports = { MatchCollection, MatchFilterIterator };
