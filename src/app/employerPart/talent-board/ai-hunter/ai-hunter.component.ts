import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AiService } from './ai.service';
import { debounceTime, finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

interface Candidate {
  id: string;
  name: string;
  title: string;
  matchScore: number;
  company: string;
  experience: string;
  location: string;
  education: string;
  skills: string[];
  aiInsight: string;
  profileUrl: string;
}

@Component({
  selector: 'app-ai-headhunter',
  templateUrl: './ai-hunter.component.html',
  styleUrls: ['./ai-hunter.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [AiService],
  standalone: true
})
export class AiHunterComponent implements OnInit {
  searchForm: FormGroup;
  candidateResults: Candidate[] = [];
  isSearching = false;
  activeTab = 'Job Description';
  totalCandidates = 0;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private aiService: AiService
  ) {
    this.searchForm = this.fb.group({
      searchText: [''],
      searchPrecision: ['Balanced'],
      experienceLevel: ['Senior'],
      locationPreference: ['Any location']
    });
  }

  ngOnInit(): void {
    // Load any saved search parameters or previous results
    this.loadSavedSearch();
    
    // React to changes in the form with debounce to avoid too many API calls
    this.searchForm.get('searchText')?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        // Optionally provide real-time suggestions as user types
        if (value && value.length > 10) {
          this.provideSuggestions(value);
        }
      });
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
    // Adjust form fields based on active tab if needed
    if (tabName === 'Skills & Requirements') {
      // Maybe change placeholder text or show different input fields
    } else if (tabName === 'Team Fit') {
      // Maybe change placeholder text or show different input fields
    }
  }

  findCandidates(): void {
    if (!this.searchForm.get('searchText')?.value) {
      this.errorMessage = 'Please enter a job description or search query.';
      return;
    }

    this.errorMessage = '';
    this.isSearching = true;
    
    const searchParams = {
      searchType: this.activeTab,
      ...this.searchForm.value
    };

    this.aiService.findCandidates(searchParams)
      .pipe(finalize(() => this.isSearching = false))
      .subscribe(
        (response) => {
          this.candidateResults = response.candidates;
          this.totalCandidates = response.totalCount;
          this.saveCurrentSearch();
        },
        (error) => {
          console.error('Error finding candidates:', error);
          this.errorMessage = 'Failed to connect with AI service. Please try again.';
        }
      );
  }

  loadMoreCandidates(): void {
    const currentCount = this.candidateResults.length;
    this.isSearching = true;

    const searchParams = {
      searchType: this.activeTab,
      ...this.searchForm.value,
      offset: currentCount,
      limit: 10
    };

    this.aiService.findCandidates(searchParams)
      .pipe(finalize(() => this.isSearching = false))
      .subscribe(
        (response) => {
          this.candidateResults = [...this.candidateResults, ...response.candidates];
        },
        (error) => {
          console.error('Error loading more candidates:', error);
          this.errorMessage = 'Failed to load additional candidates. Please try again.';
        }
      );
  }

  startNewSearch(): void {
    this.searchForm.reset({
      searchText: '',
      searchPrecision: 'Balanced',
      experienceLevel: 'Senior',
      locationPreference: 'Any location'
    });
    this.candidateResults = [];
    this.totalCandidates = 0;
    this.errorMessage = '';
  }

  saveCurrentSearch(): void {
    const searchData = {
      params: this.searchForm.value,
      activeTab: this.activeTab,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('lastAiHeadHunterSearch', JSON.stringify(searchData));
  }

  loadSavedSearch(): void {
    const savedSearch = localStorage.getItem('lastAiHeadHunterSearch');
    if (savedSearch) {
      try {
        const searchData = JSON.parse(savedSearch);
        // Only load if saved within the last 24 hours
        const savedTime = new Date(searchData.timestamp).getTime();
        const currentTime = new Date().getTime();
        const hoursDiff = (currentTime - savedTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          this.searchForm.patchValue(searchData.params);
          this.activeTab = searchData.activeTab;
          // Optionally reload the previous search results
          this.findCandidates();
        }
      } catch (e) {
        console.error('Error parsing saved search:', e);
      }
    }
  }

  saveSearch(): void {
    // Implement saving the current search to user's account
    // This would typically call a backend API
    const searchName = `AI Search - ${new Date().toLocaleDateString()}`;
    const searchData = {
      name: searchName,
      params: this.searchForm.value,
      activeTab: this.activeTab
    };
    
    this.aiService.saveSearch(searchData).subscribe(
      () => {
        alert('Search saved successfully!');
      },
      (error) => {
        console.error('Error saving search:', error);
        this.errorMessage = 'Failed to save your search. Please try again.';
      }
    );
  }

  provideSuggestions(searchText: string): void {
    // Optional functionality to provide real-time suggestions as user types
    this.aiService.getSuggestions(searchText).subscribe(
      (suggestions) => {
        // Handle suggestions - maybe show them below the textarea
        console.log('Suggestions:', suggestions);
      },
      (error) => {
        console.error('Error getting suggestions:', error);
      }
    );
  }

  viewCandidateProfile(candidateId: string): void {
    // Navigate to candidate profile or open modal
    console.log('Viewing candidate:', candidateId);
    // this.router.navigate(['/candidates', candidateId]);
  }

  contactCandidate(candidateId: string): void {
    // Open contact modal or initiate contact workflow
    console.log('Contacting candidate:', candidateId);
    // this.dialogService.open(ContactCandidateComponent, { data: { candidateId } });
  }

  applyFilters(): void {
    // Implement additional filtering logic
    console.log('Applying filters');
    // Show filter modal or expand filter options
  }
}