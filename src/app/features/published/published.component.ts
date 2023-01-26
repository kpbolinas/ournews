import { Component, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ArticlesService } from 'src/app/api/articles.service';
import { CommentsService } from 'src/app/api/comments.service';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { ModalService } from 'src/app/common/modal/modal.service';
import { TooltipService } from 'src/app/common/tooltip/tooltip.service';

interface rcFormError {
  content?: string
}

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.css']
})

export class PublishedComponent {
  @ViewChildren('comments') commentsRendered: any;
  page: number = 1;
  commentPage: number = 1;
  order = new FormControl(1);
  date = new FormControl('');
  collectionSize: number = 1;
  commentsCollectionSize: number = 1;
  article: any = null;
  articles: any[] = [];
  comments: any[] = [];
  selectedArticleId: number = 0;
  selectedCommentId: number = 0;
  orderChangeEvent: any;
  dateChangeEvent: any;
  loadArticlesEvent: any;
  loadCommentsEvent: any;
  commentsRenderEvent: any;
  commentRemoveEvent: any;
  commentsModal: any;
  removeCommentModal: any;
  rcFormErrors: rcFormError = {};
  removeCommentForm = new FormGroup({
    content: new FormControl('')
  });

  constructor(
    private router: Router,
    private articlesService: ArticlesService,
    private commentsService: CommentsService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private modalService: ModalService,
    private tooltipService: TooltipService
  ) {
    let sessionParams = {};
    let storage = sessionStorage.getItem('published-params');
    if (storage) {
      sessionParams = JSON.parse(storage);
    }
    const params = {
      page: 1,
      order: 1,
      date: '',
      ...sessionParams
    };
    sessionStorage.setItem('published-params', JSON.stringify(params));
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
    this.commentsModal = this.modalService.parseModal('#comments-modal');
    this.removeCommentModal = this.modalService.parseModal('#remove-comment-modal');
  }

  ngAfterViewInit() {
    this.commentsRenderEvent = this.commentsRendered.changes.subscribe(() => this.tooltipService.init());
  }

  setParams = (param: object) => {
    const storage = sessionStorage.getItem('published-params');
    if (storage) {
      let params = JSON.parse(storage);
      params = { ...params, ...param };
      sessionStorage.setItem('published-params', JSON.stringify(params));
    }
  };

  onPageChange = () => {
    this.loadArticles();
    this.setParams({ page: this.page });
  };

  onCommentsPageChange = () => {
    this.loadComments();
    this.setParams({ commentPage: this.commentPage });
  };

  loadArticles = () => {
    this.spinnerService.show();
    let params = `/${this.page}/${this.order.value}`;
    params = this.date.value ? `${params}/${this.date.value}` : params;
    this.loadArticlesEvent = this.articlesService.published(params)
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

  showCommentsModal = (id: number) => {
    this.selectedArticleId = id;
    this.loadComments();
    this.commentsModal.show();
  };

  loadComments = () => {
    this.spinnerService.show();
    let params = `/${this.selectedArticleId}/${this.commentPage}`;
    this.loadCommentsEvent = this.commentsService.list(params)
      .subscribe({
        next: response => {
          const { data } = response;
          this.article = data.article;
          this.comments = data.comments;
          this.commentsCollectionSize = data.last_page * 10;
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

  showRemoveCommentModal = (id: number) => {
    this.selectedCommentId = id;
    this.removeCommentForm.reset();
    this.removeCommentModal.show();
  };

  handleRemoveComment = () => {
    this.spinnerService.show();
    this.rcFormErrors = {};
    const { content } = this.removeCommentForm.value;
    const formData = new HttpParams()
      .set('content', content || '');
    this.commentRemoveEvent = this.commentsService.remove(formData, this.selectedCommentId)
      .subscribe({
        next: response => {
          const { message } = response;
          this.toastService.show(message, 'success');
          this.loadComments();
          this.removeCommentModal.hide();
        },
        error: response => {
          this.spinnerService.hide();
          switch (response?.status) {
            case 401:
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
              break;

            case 422:
              this.rcFormErrors = response.error.errors;
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
    if (this.loadCommentsEvent) {
      this.loadCommentsEvent.unsubscribe();
    }
    if (this.commentsRenderEvent) {
      this.commentsRenderEvent.unsubscribe();
    }
    if (this.commentRemoveEvent) {
      this.commentRemoveEvent.unsubscribe();
    }
  }
}
