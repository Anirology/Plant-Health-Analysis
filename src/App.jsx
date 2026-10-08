import { useState } from 'react'

const initialForm = { plant_name: '', plant_type: '', location: '', symptoms: '' }

function ResultCard({ result }) {
  return (
    <section className="result-card" aria-live="polite">
      <div className="result-heading">
        <span className="eyebrow">Plant care guidance</span>
        <h2>Analysis result</h2>
      </div>
      <div className="result-copy">
        {result.split('\n').map((line, index) => {
          if (!line.trim()) return null
          const [label, ...content] = line.split(':')
          return content.length ? <p key={index}><strong>{label}:</strong>{content.join(':')}</p> : <p key={index}>{line}</p>
        })}
      </div>
      <p className="disclaimer">This is general educational guidance and not a guaranteed diagnosis.</p>
    </section>
  )
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [requestError, setRequestError] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.plant_name.trim()) nextErrors.plant_name = 'Enter the plant name.'
    if (!form.plant_type.trim()) nextErrors.plant_type = 'Enter the plant type.'
    if (!form.symptoms.trim()) nextErrors.symptoms = 'Describe the symptoms you observed.'
    setErrors(nextErrors)
    setResult('')
    setRequestError('')
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error('The service could not complete the request.')
      const data = await response.json()
      setResult(data.analysis)
    } catch (error) {
      setRequestError('Unable to reach the analysis service. Start the backend and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Plant Health Analysis home">Plant Health Analysis</a>
        <span className="header-note">Practical plant care guidance</span>
      </header>

      <div className="hero" id="top">
        <section className="intro">
          <p className="eyebrow">Plant care, made clearer</p>
          <h1>Understand what your plant may need.</h1>
          <p className="lead">Share a few details about your plant and its symptoms. We will provide simple, cautious guidance to help you decide what to check next.</p>
          <div className="guidance-points">
            <div><span>01</span><p>Describe the visible change</p></div>
            <div><span>02</span><p>Receive likely causes to consider</p></div>
            <div><span>03</span><p>Take practical next steps</p></div>
          </div>
        </section>

        <section className="form-card" aria-labelledby="form-title">
          <div className="form-heading">
            <p className="eyebrow">New analysis</p>
            <h2 id="form-title">Tell us about your plant</h2>
            <p>Fields marked with an asterisk are required.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="field-grid">
              <label>
                Plant name <em>*</em>
                <input name="plant_name" value={form.plant_name} onChange={updateField} placeholder="e.g. Tomato" aria-invalid={!!errors.plant_name} />
                {errors.plant_name && <small>{errors.plant_name}</small>}
              </label>
              <label>
                Plant type <em>*</em>
                <input name="plant_type" value={form.plant_type} onChange={updateField} placeholder="e.g. Vegetable" aria-invalid={!!errors.plant_type} />
                {errors.plant_type && <small>{errors.plant_type}</small>}
              </label>
            </div>
            <label>
              Location <span>Optional</span>
              <input name="location" value={form.location} onChange={updateField} placeholder="e.g. Jaffna" />
            </label>
            <label>
              Symptoms observed <em>*</em>
              <textarea name="symptoms" value={form.symptoms} onChange={updateField} placeholder="Describe changes to leaves, stems, soil, growth, or pests." rows="4" aria-invalid={!!errors.symptoms} />
              {errors.symptoms && <small>{errors.symptoms}</small>}
            </label>
            {requestError && <p className="request-error" role="alert">{requestError}</p>}
            <button type="submit" disabled={loading}>{loading ? 'Analyzing plant…' : 'Analyze plant'}</button>
          </form>
        </section>
      </div>

      {result && <ResultCard result={result} />}
      <footer>Plant Health Analysis provides educational information to support everyday plant care.</footer>
    </main>
  )
}
