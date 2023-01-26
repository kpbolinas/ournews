import { Component, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ArticlesService } from 'src/app/api/articles.service';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { ModalService } from 'src/app/common/modal/modal.service';
import { TooltipService } from 'src/app/common/tooltip/tooltip.service';
import { ArticleStatus } from 'src/app/constants/article.status';

interface caFormError {
  title?: string,
  content?: string,
  photo?: string
}

@Component({
  selector: 'app-unpublished',
  templateUrl: './unpublished.component.html',
  styleUrls: ['./unpublished.component.css']
})

export class UnpublishedComponent {
  @ViewChildren('articles') articlesRendered: any;
  page: number = 1;
  order = new FormControl(1);
  date = new FormControl('');
  collectionSize: number = 1;
  articles: any[] = [];
  selectedArticleId: number = 0;
  orderChangeEvent: any;
  dateChangeEvent: any;
  articleDetailEvent: any;
  loadArticlesEvent: any;
  articlesRenderEvent: any;
  articleComposeEvent: any;
  discardEvent: any;
  returnNotesModal: any;
  discardModal: any;
  composeArticleModal: any;
  caFormErrors: caFormError = {};
  composeArticleForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    photo: new FormControl('')
  });

  constructor(
    private router: Router,
    private articlesService: ArticlesService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private modalService: ModalService,
    private tooltipService: TooltipService
  ) {
    let sessionParams = {};
    let storage = sessionStorage.getItem('unpublished-params');
    if (storage) {
      sessionParams = JSON.parse(storage);
    }
    const params = {
      page: 1,
      order: 1,
      date: '',
      ...sessionParams
    };
    sessionStorage.setItem('unpublished-params', JSON.stringify(params));
    this.page = params.page;
    this.order.setValue(params.order);
    this.date.setValue(params.date);
  }

  ngOnInit() {
    this.loadArticles();
    this.orderChangeEvent = this.order.valueChanges.subscribe(() => {
      this.loadArticles();
      this.setParams({ order: this.order.value });
    });
    this.dateChangeEvent = this.date.valueChanges.subscribe(() => {
      this.loadArticles();
      this.setParams({ date: this.date.value });
    });
    this.returnNotesModal = this.modalService.parseModal('#rn-modal');
    this.discardModal = this.modalService.parseModal('#da-modal');
    this.composeArticleModal = this.modalService.parseModal('#ca-modal');
  }

  ngAfterViewInit() {
    this.articlesRenderEvent = this.articlesRendered.changes.subscribe(() => this.tooltipService.init());
  }

  setParams = (param: object) => {
    const storage = sessionStorage.getItem('unpublished-params');
    if (storage) {
      let params = JSON.parse(storage);
      params = { ...params, ...param };
      sessionStorage.setItem('unpublished-params', JSON.stringify(params));
    }
  };

  onPageChange = () => {
    this.loadArticles();
    this.setParams({ page: this.page });
  };

  showReturnNotesModal = (notes: string) => {
    this.modalService.changeContent('#rn-modal', notes);
    this.returnNotesModal.show();
  };

  showDiscardModal = (id: number) => {
    this.selectedArticleId = id;
    this.discardModal.show();
  };

  showComposeArticleModal = async (id: number = 0) => {
    this.selectedArticleId = id;
    this.composeArticleForm.reset();
    this.caFormErrors = {};
    if (id) {
      await this.loadArticle(id);
    }
    this.composeArticleModal.show();
  };

  loadArticle = async (id: number) => {
    this.spinnerService.show();
    this.articleDetailEvent = await this.articlesService.detail(id)
      .subscribe({
        next: response => {
          const { data } = response;
          this.composeArticleForm.patchValue({
            title: data.title,
            content: data.content,
            photo: ''
          });
        },
        error: response => {
          this.spinnerService.hide();
          switch (response?.status) {
            case 401:
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
              break;

            default:
              this.toastService.show(response.error?.message);
              break;
          }
        },
        complete: () => this.spinnerService.hide()
      });
  };

  loadArticles = () => {
    this.spinnerService.show();
    let params = `/${this.page}/${this.order.value}`;
    params = this.date.value ? `${params}/${this.date.value}` : params;
    this.loadArticlesEvent = this.articlesService.unpublished(params)
      .subscribe({
        next: response => {
          const { data } = response;
          this.articles = data.articles;
          this.collectionSize = data.last_page * 10;
        },
        error: response => {
          this.spinnerService.hide();
          switch (response?.status) {
            case 401:
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
              break;
        
            default:
              this.toastService.show(response.error?.message);
              break;
          }
        },
        complete: () => this.spinnerService.hide()
      });
  };

  handleSaveDraft = () => {
    this.handleComposeArticle(ArticleStatus.DRAFT);
  };

  handleForApproval = () => {
    this.handleComposeArticle(ArticleStatus.FOR_APPROVAL);
  };

  handleComposeArticle = (status: number) => {
    this.spinnerService.show();
    const { title, content, photo } = this.composeArticleForm.value;
    const formData = new HttpParams()
      .set('title', title || '')
      .set('content', content || '')
      .set('photo', photo || '')
      .set('status', status || '');
    this.articleComposeEvent = this.articlesService.compose(formData, this.selectedArticleId)
      .subscribe({
        next: response => {
          const { message } = response;
          this.toastService.show(message, 'success');
          this.composeArticleModal.hide();
          this.loadArticles();
        },
        error: response => {
          this.spinnerService.hide();
          switch (response?.status) {
            case 401:
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
              break;

            case 422:
              this.caFormErrors = response.error.errors;
              break;
        
            default:
              this.toastService.show(response.error?.message);
              break;
          }
        },
        complete: () => this.spinnerService.hide()
      });
  };

  handleDiscard = () => {
    this.spinnerService.show();
    this.discardEvent = this.articlesService.discard(this.selectedArticleId)
      .subscribe({
        next: response => {
          const { message } = response;
          this.toastService.show(message, 'success');
          this.discardModal.hide();
          this.loadArticles();
        },
        error: response => {
          this.spinnerService.hide();
          switch (response?.status) {
            case 401:
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
              break;
        
            default:
              this.toastService.show(response.error?.message);
              break;
          }
        },
        complete: () => this.spinnerService.hide()
      });
  };

  ngOnDestroy() {
    if (this.orderChangeEvent) {
      this.orderChangeEvent.unsubscribe();
    }
    if (this.dateChangeEvent) {
      this.dateChangeEvent.unsubscribe();
    }
    if (this.loadArticlesEvent) {
      this.loadArticlesEvent.unsubscribe();
    }
    if (this.articlesRenderEvent) {
      this.articlesRenderEvent.unsubscribe();
    }
    if (this.articleDetailEvent) {
      this.articleDetailEvent.unsubscribe();
    }
    if (this.articleComposeEvent) {
      this.articleComposeEvent.unsubscribe();
    }
    if (this.discardEvent) {
      this.discardEvent.unsubscribe();
    }
  }
}
