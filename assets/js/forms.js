(function () {
  'use strict';

  const WEB3FORMS_ACCESS_KEY = '635617fa-bdb3-4ae4-b187-612ebdee417c';
  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  const SUBJECT_LABELS = {
    general: 'General Inquiry',
    webdev: 'Website Development',
    seo: 'SEO Optimization',
    design: 'UI/UX & Graphics',
    branding: 'Branding',
    social: 'Social Media',
    video: 'Video Animation'
  };

  const VALIDATORS = {
    firstName: {
      pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,49}$/,
      message: 'Enter a valid first name (2–50 letters).'
    },
    lastName: {
      pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,49}$/,
      message: 'Enter a valid last name (2–50 letters).'
    },
    email: {
      pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
      message: 'Enter a valid email address.'
    },
    phone: {
      pattern: /^(\+?\d{1,4}[\s.-]?)?(\(?\d{1,4}\)?[\s.-]?)?[\d\s.-]{7,15}$/,
      message: 'Enter a valid phone number (7–15 digits).',
      optional: true
    },
    message: {
      pattern: /^[\s\S]{10,2000}$/,
      message: 'Message must be between 10 and 2000 characters.'
    }
  };

  function getFieldGroup(input) {
    return input.closest('.form-group');
  }

  function clearFieldError(input) {
    const group = getFieldGroup(input);
    if (!group) return;
    group.classList.remove('has-error');
    const errorEl = group.querySelector('.field-error');
    if (errorEl) errorEl.remove();
    input.removeAttribute('aria-invalid');
  }

  function showFieldError(input, message) {
    const group = getFieldGroup(input);
    if (!group) return false;
    clearFieldError(input);
    group.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.textContent = message;
    group.appendChild(errorEl);
    return false;
  }

  function validateField(input, validatorKey) {
    const validator = VALIDATORS[validatorKey];
    const value = input.value.trim();

    if (!value && validator.optional) {
      clearFieldError(input);
      return true;
    }

    if (!value) {
      return showFieldError(input, 'This field is required.');
    }

    if (!validator.pattern.test(value)) {
      return showFieldError(input, validator.message);
    }

    clearFieldError(input);
    return true;
  }

  function validateForm(form) {
    const firstName = form.querySelector('#first-name');
    const lastName = form.querySelector('#last-name');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const message = form.querySelector('#message');

    const results = [
      validateField(firstName, 'firstName'),
      validateField(lastName, 'lastName'),
      validateField(email, 'email'),
      validateField(phone, 'phone'),
      validateField(message, 'message')
    ];

    const firstInvalid = [firstName, lastName, email, phone, message].find(
      (el, i) => !results[i]
    );
    if (firstInvalid) firstInvalid.focus();

    return results.every(Boolean);
  }

  function setSubmitLoading(btn, loading) {
    if (loading) {
      btn.dataset.originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add('is-loading');
      btn.innerHTML = 'Sending…';
    } else {
      btn.disabled = false;
      btn.classList.remove('is-loading');
      if (btn.dataset.originalHtml) {
        btn.innerHTML = btn.dataset.originalHtml;
      }
    }
  }

  function showFormError(form, message) {
    let alertEl = form.querySelector('.form-alert');
    if (!alertEl) {
      alertEl = document.createElement('div');
      alertEl.className = 'form-alert form-alert-error';
      alertEl.setAttribute('role', 'alert');
      form.insertBefore(alertEl, form.firstChild);
    }
    alertEl.textContent = message;
    alertEl.hidden = false;
  }

  function hideFormError(form) {
    const alertEl = form.querySelector('.form-alert');
    if (alertEl) alertEl.hidden = true;
  }

  async function submitToWeb3Forms(form) {
    const subjectValue = form.querySelector('#subject-value')?.value || 'general';
    const subjectLabel = SUBJECT_LABELS[subjectValue] || subjectValue;
    const firstName = form.querySelector('#first-name').value.trim();
    const lastName = form.querySelector('#last-name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const message = form.querySelector('#message').value.trim();
    const pageSource = document.title || window.location.pathname;

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New inquiry: ${subjectLabel} — Metanova Tech`,
      from_name: `${firstName} ${lastName}`,
      name: `${firstName} ${lastName}`,
      email,
      phone: phone || 'Not provided',
      service: subjectLabel,
      message,
      page_source: pageSource
    };

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Something went wrong. Please try again.');
    }

    return data;
  }

  function initSubjectChips() {
    document.querySelectorAll('.subject-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const container = chip.closest('.subject-chips');
        if (!container) return;
        container.querySelectorAll('.subject-chip').forEach(function (c) {
          c.classList.remove('selected');
        });
        chip.classList.add('selected');
        const hiddenInput = document.getElementById('subject-value');
        if (hiddenInput) hiddenInput.value = chip.dataset.value;
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = form.querySelectorAll('#first-name, #last-name, #email, #phone, #message');
    fields.forEach(function (input) {
      input.addEventListener('input', function () {
        clearFieldError(input);
        hideFormError(form);
      });
      input.addEventListener('blur', function () {
        const keyMap = {
          'first-name': 'firstName',
          'last-name': 'lastName',
          email: 'email',
          phone: 'phone',
          message: 'message'
        };
        const key = keyMap[input.id];
        if (key) validateField(input, key);
      });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideFormError(form);

      if (!validateForm(form)) return;

      const btn = form.querySelector('#submit-btn');
      setSubmitLoading(btn, true);

      try {
        await submitToWeb3Forms(form);
        window.location.href = 'success.html';
      } catch (err) {
        setSubmitLoading(btn, false);
        showFormError(form, err.message || 'Failed to send message. Please try again later.');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSubjectChips();
    initContactForm();
  });
})();
