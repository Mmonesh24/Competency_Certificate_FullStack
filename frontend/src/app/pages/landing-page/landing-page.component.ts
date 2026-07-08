import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  // Features list for card rendering
  features = [
    {
      icon: '🛡️',
      title: 'Security Hardening',
      description: 'Transparent AES-256 column-level PII encryption, secure hashed storage, and dynamic role-based authorization rules.'
    },
    {
      icon: '⚙️',
      title: 'Layered Architecture',
      description: 'Decoupled Service and Repository abstraction layers built cleanly on EF Core with comprehensive mock unit tests.'
    },
    {
      icon: '📄',
      title: 'Symmetric QuestPDF Workflow',
      description: 'Secure, server-side document rendering complete with embedded public check signatures and QR verification codes.'
    },
    {
      icon: '🧠',
      title: 'Gemini AI Integration',
      description: 'Competency assessments, multimodal passbook OCR image parsing, and natural language compliance assistants.'
    },
    {
      icon: '⚡',
      title: 'Enterprise Architecture',
      description: 'Native API throttling, multi-tenant workspace context filters, and multi-stage container orchestrations.'
    },
    {
      icon: '📋',
      title: 'Compliance Auditing',
      description: 'Automatic database change interceptors recording JSON mutation histories and authorized claim logs.'
    }
  ];
}
