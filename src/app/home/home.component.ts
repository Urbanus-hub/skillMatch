import { Component, OnInit } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { WhyUsComponent } from './why-us/why-us.component';
import { WorksComponent } from './works/works.component';
import { CardsComponent } from './cards/cards.component';
import { TestemonialComponent } from './testemonial/testemonial.component';
import { ReadyComponent } from './ready/ready.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet, RouterLink, Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ViewportScroller, CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    HeroComponent,
    WhyUsComponent,
    WorksComponent,
    CardsComponent,
    TestemonialComponent,
    ReadyComponent,
    FooterComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    // Subscribe to fragment changes to handle scrolling
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        // Small delay to ensure the DOM is fully loaded
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            this.viewportScroller.scrollToAnchor(fragment);
          }
        }, 100);
      }
    });
  }

  // Optional: Method to scroll to a section programmatically
  scrollToSection(sectionId: string) {
    this.router.navigate([], {
      fragment: sectionId,
      queryParamsHandling: 'preserve'
    });
  }
}