import { useState } from 'react'
import { Trans, useLingui, Plural } from '@lingui/react/macro'
import { LanguageSwitcher } from './components/LanguageSwitcher'

const INITIAL_PLANTS = [
  { id: 1, name: 'Monstera', species: 'Monstera deliciosa', frequencyDays: 7, lastWatered: daysAgo(2) },
  { id: 2, name: 'Snake Plant', species: 'Dracaena trifasciata', frequencyDays: 14, lastWatered: daysAgo(1) },
  { id: 3, name: 'Pothos', species: 'Epipremnum aureum', frequencyDays: 5, lastWatered: daysAgo(6) },
  { id: 4, name: 'Fiddle Leaf Fig', species: 'Ficus lyrata', frequencyDays: 7, lastWatered: daysAgo(8) },
  { id: 5, name: 'Peace Lily', species: 'Spathiphyllum wallisii', frequencyDays: 5, lastWatered: daysAgo(3) },
]

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function daysSince(date) {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
}

function needsWater(plant) {
  return daysSince(plant.lastWatered) >= plant.frequencyDays
}

function App() {
  const { t } = useLingui()
  const [plants, setPlants] = useState(INITIAL_PLANTS)
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formSpecies, setFormSpecies] = useState('')
  const [formFrequency, setFormFrequency] = useState('')

  const thirstyCount = plants.filter(needsWater).length

  function waterPlant(id) {
    setPlants(prev => prev.map(p => p.id === id ? { ...p, lastWatered: new Date() } : p))
  }

  function addPlant(e) {
    e.preventDefault()
    const freq = parseInt(formFrequency, 10)
    if (!formName.trim() || !freq || freq < 1) return
    setPlants(prev => [
      ...prev,
      {
        id: Date.now(),
        name: formName.trim(),
        species: formSpecies.trim() || t`Unknown species`,
        frequencyDays: freq,
        lastWatered: new Date(),
      },
    ])
    setFormName('')
    setFormSpecies('')
    setFormFrequency('')
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 py-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-emerald-700 tracking-tight">Sprout</h1>
          <LanguageSwitcher />
        </div>
        <p className="text-stone-500 mt-1 text-lg"><Trans>Keep your plants alive.</Trans></p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Summary */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-stone-600 text-lg">
            <Plural
              value={thirstyCount}
              zero="All your plants are happy."
              one="1 plant needs water today."
              other="# plants need water today."
            />
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Trans>Add plant</Trans>
          </button>
        </div>

        {/* Add plant form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-stone-800 mb-4"><Trans>Add a new plant</Trans></h2>
            <form onSubmit={addPlant} className="space-y-4">
              <div>
                <label htmlFor="plant-name" className="block text-sm font-medium text-stone-700 mb-1">
                  <Trans>Plant name</Trans>
                </label>
                <input
                  id="plant-name"
                  type="text"
                  placeholder={t`e.g. Monstera deliciosa`}
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="plant-species" className="block text-sm font-medium text-stone-700 mb-1">
                  <Trans>Species</Trans>
                </label>
                <input
                  id="plant-species"
                  type="text"
                  placeholder={t`e.g. Epipremnum aureum`}
                  value={formSpecies}
                  onChange={e => setFormSpecies(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="plant-frequency" className="block text-sm font-medium text-stone-700 mb-1">
                  <Trans>Watering frequency (days)</Trans>
                </label>
                <input
                  id="plant-frequency"
                  type="number"
                  min="1"
                  placeholder={t`e.g. 7`}
                  value={formFrequency}
                  onChange={e => setFormFrequency(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Trans>Save</Trans>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Trans>Cancel</Trans>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Plant grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plants.map(plant => {
            const days = daysSince(plant.lastWatered)
            const thirsty = needsWater(plant)
            return (
              <div
                key={plant.id}
                className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-3 ${thirsty ? 'border-amber-300' : 'border-stone-200'}`}
              >
                <div>
                  <h3 className="text-lg font-semibold text-stone-800">{plant.name}</h3>
                  <p className="text-sm text-stone-500 italic">{plant.species}</p>
                </div>
                <p className="text-sm text-stone-600">
                  <Plural
                    value={days}
                    zero="Last watered today"
                    one="Last watered 1 day ago"
                    other="Last watered # days ago"
                  />
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      thirsty
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {thirsty ? t`Needs water` : t`Healthy`}
                  </span>
                  <button
                    type="button"
                    onClick={() => waterPlant(plant.id)}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trans>Water now</Trans>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-stone-400 border-t border-stone-200 mt-12">
        <Trans>&copy; 2026 Sprout. Made for forgetful plant parents.</Trans>
      </footer>
    </div>
  )
}

export default App
