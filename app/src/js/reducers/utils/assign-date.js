export default function assignDate (object) {
  return { queriedAt: Date.now(), ...object };
}
